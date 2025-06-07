// Type definitions as JSDoc comments for better IDE support

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} name
 * @property {string} email
 * @property {string} [phone]
 * @property {string} [address]
 * @property {string} [email_verified_at]
 * @property {string[]} roles
 * @property {Reservation[]} [reservations]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Author
 * @property {number} id
 * @property {string} name
 * @property {string} [biography]
 * @property {string} [birth_date]
 * @property {Book[]} [books]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Category
 * @property {number} id
 * @property {string} name
 * @property {string} [description]
 * @property {Book[]} [books]
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Book
 * @property {number} id
 * @property {string} title
 * @property {string} isbn
 * @property {number} published_year
 * @property {string} [description]
 * @property {string} [cover_image]
 * @property {number} total_copies
 * @property {number} available_copies
 * @property {Author} author
 * @property {Category[]} categories
 * @property {boolean} is_available
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} Reservation
 * @property {number} id
 * @property {User} user
 * @property {Book} book
 * @property {string} reserved_at
 * @property {string} due_date
 * @property {string} [returned_at]
 * @property {"borrowed" | "returned"} status
 * @property {boolean} is_overdue
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} success
 * @property {string} message
 * @property {*} [data]
 * @property {*} [errors]
 */

/**
 * @typedef {Object} PaginatedResponse
 * @property {*[]} data
 * @property {number} current_page
 * @property {number} last_page
 * @property {number} per_page
 * @property {number} total
 * @property {number} from
 * @property {number} to
 */

/**
 * @typedef {Object} LoginCredentials
 * @property {string} email
 * @property {string} password
 */

/**
 * @typedef {Object} RegisterData
 * @property {string} name
 * @property {string} email
 * @property {string} password
 * @property {string} password_confirmation
 * @property {string} [phone]
 * @property {string} [address]
 */

export {}
