const mm = require('music-metadata')

const ratingRegex = /!(?<rating>\d+)\s?(?<mood>.*)/

export const getRatingAndMood = (fullFilePath) => {
  try {
    // Parse the metadata from the audio file
    mm.parseFile(fullFilePath).then(metadata => {
      
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

      if (!commentTag) {
        throw new Error('No comment tag found in file');
      }

      // use the regex to extract the rating and mood from the comment tag
      const ratingAndMood = ratingRegex.exec(commentTag);
      
      if (!ratingAndMood) {
        throw new Error('Invalid rating format in comment tag');
      }

      // return the rating and mood as { rating, mood }
      return {
        rating: ratingAndMood.groups.rating,
        mood: ratingAndMood.groups.mood,
      }
    })
  } catch (error) {
    throw new Error(`Failed to extract rating: ${error.message}`);
  }
}
