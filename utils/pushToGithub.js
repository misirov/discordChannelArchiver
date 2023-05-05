/**
 * Clone remote repository, add, commit and push files.
 * Github will require username and password (token) during the first push. Then it's cached and not requested anymore.
 * Only triggered from main.js when user types "push".
 * @returns array of messages
**/

// @TODO: NEED TO MOVE ALL THE FILES + FIRS TO REPO BEFORE PUSHING

const git = require('simple-git');
const path = require('path');
const fs = require('fs')
require('dotenv').config();

const repoURL = process.env.REPO_URL

module.exports = async function pushToGitHub(fileType) {
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
        // Move all files from output directory to clonedRepo directory
        fs.readdirSync(outputDir).forEach(file => {
            if (file.endsWith(`.${fileType}`)) {
                const oldPath = path.join(outputDir, file);
                const newPath = path.join(localPath, file);
                fs.renameSync(oldPath, newPath);
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
