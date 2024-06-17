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