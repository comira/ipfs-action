const IpfsHttpClient = require('ipfs-http-client');
const fsPath = require("path");
const { globSource } = IpfsHttpClient;

module.exports = {
  async upload({ host, port, protocol, path, timeout, verbose }) {
    const root = fsPath.basename(path);
    if(verbose) console.log("root",root);
    const ipfs = IpfsHttpClient({ host, port, protocol, timeout });
    const source = await ipfs.add(globSource(path, { recursive: true }), { pin: true });

    let rootHash;
    for await (const file of source) {
      if (verbose)
        console.log(file.path, file.cid.toString())

      if (root === file.path) {
        rootHash = file.cid.toString();
      }
    }

    if (!rootHash) {
      throw new Error('Content hash is not found.');
    }

    return rootHash;
  }
}
