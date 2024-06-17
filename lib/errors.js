export class NotFound extends Error {
    constructor() {
        super()
        this.name = 'NotFound'
    }
}

export class PasswordsNotMatching extends Error {
    constructor() {
        super()
        this.name = 'PasswordsNotMatching'
    }
}

export class PasswordTooWeak extends Error {
    constructor() {
        super()
        this.name = 'PasswordTooWeak'
    }
}

export class Unauthorized extends Error {
    constructor() {
        super()
        this.name = "Unauthorized"
    }
}

export class ExistingGame extends Error {
    constructor() {
        super()
        this.name = "ExistingGame"
    }
}

export class GenreNotFound extends Error {
    constructor() {
        super()
        this.name = "GenreNotFound"
    }
}

export class CantReviewTwice extends Error {
    constructor() {
        super()
        this.name = "CantReviewTwice"
    }
}