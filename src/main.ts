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
                releaseAsset = latestRelease.assets.find((a) => a.name.endsWith("tar.gz"));
                break;
            case "darwin":
                if (arch) {
                    releaseAsset = latestRelease.assets.find((a) => a.name.includes(arch) && a.name.endsWith("dmg"));
                } else {
                    // TODO: Temporary hack until all release assets have the architecture in their names.
                    releaseAsset = latestRelease.assets.find(
                        (a) => !a.name.includes("arm64") && a.name.endsWith("dmg")
                    );
                }
                break;
            case "windows":
                releaseAsset = latestRelease.assets.find((a) => a.name.endsWith("exe"));
                break;
            default:
                throw new Error(`Unknown OS type ${os}`);
        }

        if (releaseAsset) {
            btn.href = releaseAsset.browser_download_url;
            btn.removeAttribute("disabled");
            const versionTooltip = `Version ${latestRelease.tag_name}`;
            const versionTooltipClassName = "version-tooltip-target";
            if (btn.classList.contains(versionTooltipClassName)) {
                btn.dataset.tooltip = versionTooltip;
            } else {
                const el = document.querySelector(`.${os}.${versionTooltipClassName}`) as HTMLElement;
                if (!el) {
                    console.warn("Did not find a target el for the version tooltip");
                    return;
                }
                el.dataset.tooltip = versionTooltip;
            }
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
