import * as os from 'os';
import * as core from '@actions/core';
import { getInput, info, error } from '@actions/core';
import { exec } from '@actions/exec';

const applicationName = getInput('app-name', { required: true });
const applicationVersion = getInput('app-version');

const installUsingChocolatey = (applicationName: string, applicationVersion?: string) => {
    const version = applicationVersion ? `--version ${applicationVersion}` : '';
    return { installer: 'choco', command: `install ${applicationName} ${version}` };
}
const installUsingApt = (applicationName: string, applicationVersion?: string) => {
    const version = applicationVersion ? `=${applicationVersion}` : '';
    return { installer: 'apt-get', command: `install ${applicationName}${version}` };
}
const installUsingHomebrew = (applicationName: string, applicationVersion?: string) => {
    const version = applicationVersion ? `@${applicationVersion}` : '';
    return { installer: 'homebrew', command: `install ${applicationName}${version}` };
}

function getPlatformInstaller(applicationName: string, applicationVersion?: string) {
    const platform = os.platform();
    switch (platform) {
        case "darwin":
            return installUsingHomebrew(applicationName, applicationVersion);
        case "linux":
            return installUsingApt(applicationName, applicationVersion);
        case "win32":
            return installUsingChocolatey(applicationName, applicationVersion);
        case "aix":
        case "android":
        case "freebsd":
        case "openbsd":
        case "sunos":
        case "cygwin":
        case "netbsd":
            throw new Error(`Platform '${platform}' is not supported`);
    }
}

const handler = getPlatformInstaller('ffmpeg');
info(`using ${handler.installer} with command '${handler.command}'`)

console.log(handler)
exec('')
    .then()
    .catch(error);
