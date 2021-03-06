import { Command } from '../command';
import chalk from 'chalk';
import { File } from '../lib/file';

export class KeyCreateCommand extends Command {

    public signature = 'key-create <output_file>';

    public description = 'Create a key file for a new wallet';

    async action(path: string) {

        const wallet = await this.arweave.wallets.generate();
        const address = await this.arweave.wallets.jwkToAddress(wallet);

        const file = new File(path ? path : `arweave-keyfile-${address}.json`, this.cwd);

        if (await file.exists()) {
            let confirmed = await this.confirm(
                chalk.redBright(`Looks like the output file already exists, do you want to overwrite it? Y/N\n`)
            );

            if (!confirmed) {
                throw new Error(`User cancelled`);
            }
        }

        await file.write(Buffer.from(JSON.stringify(wallet, null, 4)));

        this.print([
            chalk.cyanBright(`Your new wallet address: ${address}\n`),
            ``,
            `Successfully saved key to ${path}`,
            `Set this wallet as your default by using 'arweave key-save ${path}'`
        ]);
    }

}