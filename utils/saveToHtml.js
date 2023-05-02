/**
 * Save messages to HTML format
 * 
**/

const fs = require('fs');
const path = require('path');

module.exports = function saveToHtml(channel, listOfMessageObjects) {
    // Create HTML table with messages
    let tableHtml = "<table><tr><th>User</th><th>Message</th><th>Date</th></tr>";
    listOfMessageObjects.forEach(message => {
        tableHtml += `<tr><td>${message.User}</td><td>${message.Content}</td><td>${message.Date}</td></tr>`;
    });
    tableHtml += "</table>";

    // Create full HTML file with table
    var html = `<html>
<head>
 <title> Spearbit Discord channel: ${channel.name} </title>
 <style>
     table {
         border-collapse: collapse;
         width: 100%;
     }
     th, td {
         text-align: left;
         padding: 8px;
         border-bottom: 1px solid #ddd;
     }
     th {
         background-color: #f2f2f2;
     }
 </style>
</head>
 <body>
     <h1>Channel: ${channel.name}</h1>
     <table>
         <thead>
             <tr>
                 <th>User</th>
                 <th>Content</th>
                 <th>Date</th>
             </tr>
         </thead>
         <tbody>
             ${listOfMessageObjects.map(messageObject => `
             <tr>
                 <td>${messageObject.User}</td>
                 <td>${messageObject.Content}</td>
                 <td>${messageObject.Date}</td>
             </tr>
             `).join('')}
         </tbody>
     </table>
 </body>
</html>`

    const outputDir = 'output';
    const fileName = `${channel.name}_channel.html`;
    const filePath = path.join(outputDir, fileName);

    // If check if output directory exists, else create it
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }

    fs.writeFile(filePath, html, (err) => {
        console.log('\nsaving as html...')
        if (err) {
            throw err;
        }
        process.stdout.write(`Finished writing to file: ${filePath}. \n---> Exit with CTRL+C or enter another channel ID > `);
    });
}
