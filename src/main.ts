interface ReleaseAsset {
    created_at: string;
    updated_at: string;
    browser_download_url: string;
    name: string;
}

interface GitHubRelease {
    url: string;
    tag_name: string;
    assets: ReleaseAsset[];
}

let latestRelease: GitHubRelease | undefined;

async function getLatestVersion() {
    const resp = await fetch("https://api.github.com/repos/pulumi-desktop/app/releases/latest");
    latestRelease = await resp.json();
}

function enableDownloadButtons() {
    const buttons = document.getElementsByClassName("download-btn");
    for (let i = 0; i < buttons.length; i++) {
        const btn = buttons[i] as HTMLAnchorElement;
        const os = btn.dataset.os;
        let releaseAsset: ReleaseAsset | undefined;
        switch (os) {
            case "linux":
                releaseAsset = latestRelease.assets.find((a) => a.name.includes("snap"));
                break;
            case "darwin":
                releaseAsset = latestRelease.assets.find((a) => a.name.includes("dmg"));
                break;
            case "windows":
                releaseAsset = latestRelease.assets.find((a) => a.name.includes("exe"));
                break;
        }

        if (releaseAsset) {
            btn.href = releaseAsset.browser_download_url;
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

export {};
