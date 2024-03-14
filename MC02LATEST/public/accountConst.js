function Account(username, password) {
    this.username = username;
    this.password = password;
}

const sampleAccounts = [
    new Account('Gian', 'password1'),
    new Account('Luis', 'password2'),
    new Account('Jeck', 'password3'),
    new Account('TestUser1', 'password4'),
    new Account('TestUser', 'password5')
];

function addAccount(username, password) {
    const newAccount = new Account(username, password);
    sampleAccounts.push(newAccount);
    console.log('New account added:', newAccount.username);
}

module.exports = { Account, sampleAccounts, addAccount };
