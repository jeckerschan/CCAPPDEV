function Post (id, title, description, tags, upvotes, downvotes) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
}

const samplePosts = [

    new Post (1, 'Sinigang', 'Sinigang is a delicious delicacy which originated in the Philippines', ['CCS', 'CLA'], 0, 0),
    new Post (2, 'Adobo', 'I love adobo', ['GCOE', 'COS'], 0, 0),
    new Post (3, 'DLSU', 'De La Salle University is a school', ['COB'], 0, 0),
    new Post (4, 'Hello World', 'Hello there world', ['CLA'], 0, 0),
    new Post (5, 'TITLE', 'Testing description', ['USG'], 0, 0)

];

module.exports = {Post, samplePosts};