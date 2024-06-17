
const genres = await Genre.create(genresData)
        console.log("genres created");
    
        // uses reduce to provide the specific id for each genre name 
        const genreMap = genres.reduce((acc, genre) => {
            acc[genre.name] = genre._id;
            return acc;
        }, {});
    
    
        // foreach through the game data to set the array of genres with their respective ids.
        gamesData.forEach(game => {
            game.addedBy = user._id;
            const genreNames = gameGenreMapping[game.name] || [];
            game.genres = genreNames.map(name => genreMap[name]).filter(Boolean);
        });