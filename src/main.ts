import themeSwitcher from "./themeSwitcher";

interface ReleaseAsset {
    created_at: string;
    updated_at: string;
    browser_download_url: string;
    name: string;
}

interface GitHubRelease {
    /**
     * The name of the release when the release was published.
     */
    name: string;
    url: string;
    tag_name: string;
    assets: ReleaseAsset[];
}

const osLookup = {
    linux: "Linux",
    darwin: "macOS",
    windows: "Windows",
};

let latestRelease: GitHubRelease | undefined;

async function getLatestVersion() {
    const resp = await fetch("https://api.github.com/repos/pulumi-desktop/app/releases/latest");
    if (resp.status !== 200) {
        throw new Error(`response does not indicate a success: ${resp.statusText}`);
    }
    latestRelease = await resp.json();
}

function enableDownloadButtons() {
    if (!latestRelease) {
        return;
    }

    const buttons = document.getElementsByClassName("download-btn");
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i] as HTMLAnchorElement;
        const os = btn.dataset.os;
        const arch = btn.dataset.arch;
        let releaseAsset: ReleaseAsset | undefined;
        switch (os) {
            case "linux":
                releaseAsset = latestRelease.assets.find((a) => a.name.includes("snap"));
                break;
            case "darwin":
                if (arch) {
                    releaseAsset = latestRelease.assets.find((a) => a.name.includes(arch) && a.name.includes("dmg"));
                } else {
                    releaseAsset = latestRelease.assets.find((a) => a.name.includes("dmg"));
                }
                break;
            case "windows":
                releaseAsset = latestRelease.assets.find((a) => a.name.includes("exe"));
                break;
            default:
                throw new Error(`Unknown OS type ${os}`);
        }

        if (releaseAsset) {
            btn.href = releaseAsset.browser_download_url;
            let text = `Download ${latestRelease.tag_name} for ${osLookup[os]} `;
            if (arch) {
                text += `${arch}`;
            } else {
                text += "x64";
            }
            btn.text = text;
            btn.removeAttribute("disabled");
        }
    }
}

if (!window.fetch) {
    console.error("Browser does not support fetch!");
} else {
    getLatestVersion()
        .then(() => enableDownloadButtons())
        .catch((err: any) => console.error("Failed to fetch the latest version", err));
}

themeSwitcher.init();

export {};
