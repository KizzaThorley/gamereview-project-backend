
export default function errorHandler(err, req, res, next) {
    console.log(`🤖 Something Went Wrong!
    Error: ${err.name}
    `)
    console.log(err)
  
    if (err.name === 'NotFound' || err.name === 'CastError') {
      return res.status(404).json({ message: 'Not Found' })
    }
  
    if (err.name === 'ValidationError') {
      const customErrors = {}
  
      for (const key in err.errors) {
        customErrors[key] = err.errors[key].message
      }
  
      return res.status(422).json(customErrors)
    }
  
    if (err.name === 'PasswordTooWeak') {
      return res.status(401).json({ message: 'Your password must contain the following: at least 8 characters, 1 special character (!@#$%^&*) and 1 uppercase character'})
    }

    if (err.name === "PasswordsNotMatching") {
        return res.status(401).json({message: "Your password and password confirmation do not match."})
    }

    if (err.name === "Unauthorized") {
        return res.status(401).json({message: "You are not authorised."})
    }

    if (err.name === "ExistingGame") {
      return res.status(401).json({message: "This game already exists."})
    }

    if (err.name === "GenreNotFound") {
      return res.status(401).json({message: "This genre does not exist."})
    }

    if (err.name === "CantReviewTwice") {
      return res.status(401).json({message: "You can't review the same game twice."})
    }

    if (err.name === "Required") {
      return res.status(401).json({message: "Please fill in all required fields"})
    }
  
    res.sendStatus(500)
    next(err)
  }
