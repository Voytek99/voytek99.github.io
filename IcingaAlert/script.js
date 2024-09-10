document.addEventListener('DOMContentLoaded', () => {
    loadFile();
});

// Object mapping contacts to their email addresses
const contact_to_email = {
    "linux_experts": "linux-experts@atos.net",
    "wbc_ad_win_services": "wbc-ad-win-services@atos.net",
    "dl_de_uni_moco_service": "dl-de-uni-moco-service@atos.net",
    "UNI_XSP": "xspteam@atos.net",
    "wbc_exchange": "wbc-exchange@atos.net",
    "it_solutions_oco_sap": "IT-Solutions-OCO-SAP@atos.net",
    "ms_co_oco_sued3": "MS-CO-OCO-Sued3@atos.net",
    "dl_de_smb_aix": "dl-de-smb-aix@atos.net",
    "dlde_ats_dbs_db2": "dlde-ats-dbs-db2@atos.net"
};

const ccEmail = "gmpl-BridgePL-SMB@atos.net";  // Always CC this email

function loadFile() {
    fetch('scraped_data.txt')  // Name of your text file
        .then(response => response.text())
        .then(text => {
            const data = parseTextFile(text);
            const sortedData = sortDataByTimestamp(data);
            displayData(sortedData);
        })
        .catch(error => console.error('Error loading the file:', error));
}

function parseTextFile(text) {
    const lines = text.trim().split('\n');
    const data = [];
    
    for (let i = 0; i < lines.length; i += 5) {
        if (i + 4 < lines.length) {
            const [link, name, alert, server, timestamp] = lines.slice(i, i + 5);
            data.push({ link, name, alert, server, timestamp });
        }
    }
    
    return data;
}

function sortDataByTimestamp(data) {
    // Sort in descending order (newest first)
    return data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
}

function displayData(data) {
    const tableBody = document.querySelector('#dataTable tbody');
    tableBody.innerHTML = '';

    data.forEach(row => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><a href="${row.link}" target="_blank">${row.link}</a></td>
            <td>${row.name}</td>
            <td>${row.alert}</td>
            <td>${row.server}</td>
            <td>${row.timestamp}</td>
            <td>
                <button onclick="sendMail('${row.server}', '${row.name}', '${row.alert}', '${row.timestamp}')">Send Email</button>
            </td>
        `;
        tableBody.appendChild(tr);
    });
}

function sendMail(server, name, alert, timestamp) {
    // Search for the contact emails by checking if any key in contact_to_email exists in the server string
    const recipients = findContactEmails(server);

    // If no contacts found, fall back to the default recipient format
    if (recipients.length === 0) {
        recipients.push(`${name}@yourcompany.com`);
    }

    const subject = `${name}`;
    const body = `Hallo Team,\n\nBitte prüfen.\nDatum der Meldung: ${timestamp.substring(0, 10)}\nDie Uhrzeit: ${timestamp.substring(11)}\n\n`;
    
    // Prepare the mailto link
    const mailtoLink = `mailto:${recipients.join(',')}?cc=${ccEmail}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Redirect to mailto link
    window.location.href = mailtoLink;
}


function findContactEmails(server) {
    const emails = [];

    for (const contact in contact_to_email) {
        const regex = new RegExp(contact, 'i'); // Case-insensitive check
        if (regex.test(server)) {  // If contact string is found in server
            emails.push(contact_to_email[contact]);
        }
    }

    return emails;
}
