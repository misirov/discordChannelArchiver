/**
 * Clone remote repository, add, commit and push files.
 * Github will require username and password (token) during the first push. Then it's cached and not requested anymore.
 * Only triggered from main.js when user types "push".
**/

const git = require('simple-git');
const path = require('path');
const fs = require('fs')
const fsExtra = require('fs-extra');
require('dotenv').config();

const repoURL = process.env.REPO_URL

async function pushToGitHub(fileType) {
    const outputDir = path.join(__dirname, '../output');
    const localPath = path.join(outputDir, 'clonedRepo');

    // Clone the remote repository if it's not yet cloned
    if (!fs.existsSync(localPath)) {
        console.log(`Cloning remote repository: ${repoURL}`);
        await git().clone(repoURL, localPath);
        console.log(`Cloned!`);
    }

    const gitInstance = git(localPath);

    try {
        // Move all files and directories from output directory to clonedRepo directory
        fs.readdirSync(outputDir).forEach(fileOrDir => {
            // Skip the clonedRepo directory
            if (fileOrDir === 'clonedRepo') return;

            const oldPath = path.join(outputDir, fileOrDir);
            const newPath = path.join(localPath, fileOrDir);

            // Check if it's a file or a directory
            if (fs.statSync(oldPath).isFile()) {
                if (fileOrDir.endsWith(`.${fileType}`)) {
                    fs.renameSync(oldPath, newPath);
                }
            } else {
                fsExtra.moveSync(oldPath, newPath);
            }
        });

        // Add all files in the clonedRepo directory to the git instance
        await gitInstance.add(`*.${fileType}`);

        // Commit the changes
        const commitMessage = `Archive channels in ${fileType.toUpperCase()}`;
        await gitInstance.commit(commitMessage);

        // Pull the latest changes from the remote repository
        await gitInstance.pull('origin', 'main');

        // Push the changes to the remote repository
        await gitInstance.push('origin', 'main');
        console.log('Pushed the changes to GitHub successfully!');
    } catch (error) {
        console.log('Error pushing to GitHub:', error);
    }
}


module.exports = {
    pushToGitHub
}
