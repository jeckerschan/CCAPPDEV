function Account(username, password, accountID) {
    this.username = username;
    this.password = password;
    this.accountID = accountID;
}

const sampleAccounts = [
    new Account('Gian', 'password1', '0001'),
    new Account('Luis', 'password2', '0002'),
    new Account('Jeck', 'password3', '0003'),
    new Account('TestUser1', 'password4', '0004'),
    new Account('TestUser', 'password5', '0005')
];

function addAccount(username, password, accountID) {
    const newAccount = new Account(username, password, accountID);
    sampleAccounts.push(newAccount);
    console.log('New account added:', newAccount.username);
}

module.exports = { Account, sampleAccounts, addAccount };
