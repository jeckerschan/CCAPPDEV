function Post (id, title, description, tags, upvotes, downvotes, comments, accountID) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
    this.comments = comments;
    this.accountID = accountID;
}

let samplePosts = [

    new Post (0, 'Sinigang', 'Sinigang is a delicious delicacy which originated in the Philippines', ['CCS', 'CLA'], 0, 0, [], '0001'),
    new Post (1, 'Adobo', 'I love adobo', ['GCOE', 'COS'], 0, 0, [], '0001'),
    new Post (2, 'DLSU', 'De La Salle University is a school', ['COB'], 0, 0, [], '0003'),
    new Post (3, 'Hello World', 'Hello there world', ['CLA'], 0, 0, [], '0002'),
    new Post (4, 'TITLE', 'Testing description', ['USG'], 0, 0, [], '0004')

];

module.exports = {Post, samplePosts};