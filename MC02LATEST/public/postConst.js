function Post (id, title, description, tags) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.tags = tags;
}

const samplePosts = [

    new Post (1, 'Sinigang', 'Sinigang is a delicious delicacy which originated in the Philippines', ['CCS', 'CLA']),
    new Post (2, 'Adobo', 'I love adobo', ['GCOE', 'COS']),
    new Post (3, 'DLSU', 'De La Salle University is a school', ['COB']),
    new Post (4, 'Hello World', 'Hello there world', ['CLA']),
    new Post (5, 'TITLE', 'Testing description', ['USG'])

];

module.exports = {Post, samplePosts};