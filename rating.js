const { loadMusicMetadata } = require('music-metadata');
const NodeID3 = require('node-id3');

const ratingRegex = /!(?<rating>\d+)\s?(?<mood>.*)/

module.exports = (fullFilePath) => new Promise((resolve, reject) => {
  try {
    // Parse the metadata from the audio file
    //
    loadMusicMetadata().then((mm) => mm.parseFile(fullFilePath).then(metadata => {
      
      // Try to find comments in different possible locations
      let commentTag = '';
      
      // Check ID3v2 comments
      if (metadata.native['ID3v2.4'] || metadata.native['ID3v2.3']) {
        const comments = (metadata.native['ID3v2.4'] || metadata.native['ID3v2.3'])
          .filter(tag => tag.id === 'COMM');
        if (comments.length > 0) {
          commentTag = comments[0].value.text || comments[0].value;
        }
      }
      
      // Check iTunes comments if no ID3v2 comment found
      if (!commentTag && metadata.native['iTunes']) {
        const comments = metadata.native['iTunes']
          .filter(tag => tag.id === '©cmt');
        if (comments.length > 0) {
          commentTag = comments[0].value;
        }
      }
      
      // Check native format comments as fallback
      if (!commentTag && metadata.common.comment) {
        commentTag = Array.isArray(metadata.common.comment) 
          ? metadata.common.comment[0] 
          : metadata.common.comment;
      }

      if (!commentTag) return resolve({ plexId: null })

      // use the regex to extract the rating and mood from the comment tag
      const ratingAndMood = ratingRegex.exec(commentTag);
      
      if (!ratingAndMood) return resolve({ plexId: null })

      // Read the Plex ID from publisher tag
      const tags = NodeID3.read(fullFilePath) 
      if (!tags.publisher) return resolve({ plexId: null })
      

      const results = {
        rating: ratingAndMood.groups.rating,
        mood: ratingAndMood.groups.mood,
        plexId: tags.publisher
      }

      // return the rating and mood as { rating, mood }
      return resolve(results)
    }))
  } catch (error) {
    resolve({ file: fullFilePath, error: error.message })
  }
})
