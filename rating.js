const ratingRegex = /!(?P<rating>\d+)\s?(?P<mood>.*)/

export const getRatingAndMood = (fullFilePath) => {
  // get the 'comment' id3 tag from the file (might be mp3 or m4a or ogg)
  const commentTag = '' // fill this out
  // use the regex to extract the rating and mood from the comment tag
  const ratingAndMood = ratingRegex.exec(commentTag)
  // return the rating and mood as { rating, mood }
  return {
    rating: ratingAndMood.groups.rating,
    mood: ratingAndMood.groups.mood,
  }
}
