const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, '../index.html');
let indexHtml = fs.readFileSync(indexPath, 'utf-8');

const releaseVersion = process.env.RELEASE_VERSION;
const releaseUrl = process.env.RELEASE_URL;

if (!releaseVersion || !releaseUrl) {
    console.error('Error: RELEASE_VERSION and RELEASE_URL environment variables are required.');
    process.exit(1);
}

const bannerHtml = `
        <!-- LATEST_RELEASE_START -->
        <section class="py-4 flex flex-col justify-center bg-blue-50 dark:bg-blue-900/20 border-y border-blue-100 dark:border-blue-800">
            <div class="container flex flex-col sm:flex-row items-center justify-center gap-4 text-center pb-2">
                <span class="text-sm font-medium text-blue-800 dark:text-blue-200">
                    🎉 New Release Available: <strong>${releaseVersion}</strong>
                </span>
                <a href="${releaseUrl}" target="_blank" class="rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold text-black hover:bg-blue-700 transition-colors dark:text-black" style="color: black !important;">
                    Download Now
                </a>
            </div>
            <div class="container flex justify-center text-center mt-2">
                <span class="text-xs text-gray-500 dark:text-gray-400">
                    Or install via Homebrew: <code class="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-blue-600 dark:text-blue-400 font-mono">brew install teamajayji/tap/ajayji</code>
                </span>
            </div>
        </section>
        <!-- LATEST_RELEASE_END -->`;

const startMarker = '<!-- LATEST_RELEASE_START -->';
const endMarker = '<!-- LATEST_RELEASE_END -->';

const startIndex = indexHtml.indexOf(startMarker);
const endIndex = indexHtml.indexOf(endMarker) + endMarker.length;

if (startIndex === -1 || indexHtml.indexOf(endMarker) === -1) {
    console.error('Error: Could not find release markers in index.html');
    process.exit(1);
}

const newHtml = indexHtml.substring(0, startIndex) + bannerHtml.trim() + indexHtml.substring(endIndex);

fs.writeFileSync(indexPath, newHtml, 'utf-8');
console.log(`Successfully updated index.html with release ${releaseVersion}`);
