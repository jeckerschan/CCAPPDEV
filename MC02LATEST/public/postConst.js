function Post (id, title, description, tags, upvotes, downvotes) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
    this.upvotes = upvotes;
    this.downvotes = downvotes;
}

const samplePosts = [

    new Post (0, 'Sinigang', 'Sinigang is a delicious delicacy which originated in the Philippines', ['CCS', 'CLA']),
    new Post (1, 'Adobo', 'I love adobo', ['GCOE', 'COS']),
    new Post (2, 'DLSU', 'De La Salle University is a school', ['COB']),
    new Post (3, 'Hello World', 'Hello there world', ['CLA']),
    new Post (4, 'TITLE', 'Testing description', ['USG'])

];

module.exports = {Post, samplePosts};