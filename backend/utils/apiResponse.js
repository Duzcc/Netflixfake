/**
 * API Response Utility
 * Standardized response format for all API endpoints
 */

export class ApiResponse {
    /**
     * Success response
     * @param {Object} res - Express response object
     * @param {*} data - Response data
     * @param {String} message - Success message
     * @param {Number} statusCode - HTTP status code
     */
    static success(res, data = null, message = 'Success', statusCode = 200) {
        return res.status(statusCode).json({
            status: 'success',
            message,
            data,
        });
    }

    /**
     * Error response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {Number} statusCode - HTTP status code
     * @param {*} error - Error details (only in development)
     */
    static error(res, message = 'Error occurred', statusCode = 500, error = null) {
        const response = {
            status: 'error',
            message,
        };

        // Include error details only in development
        if (process.env.NODE_ENV === 'development' && error) {
            response.error = error;
        }

        return res.status(statusCode).json(response);
    }

    /**
     * Pagination response
     * @param {Object} res - Express response object
     * @param {Array} data - Response data array
     * @param {Number} page - Current page
     * @param {Number} limit - Items per page
     * @param {Number} total - Total items count
     * @param {String} message - Success message
     */
    static paginated(res, data, page, limit, total, message = 'Success') {
        const totalPages = Math.ceil(total / limit);

        return res.status(200).json({
            status: 'success',
            message,
            data,
            pagination: {
                currentPage: parseInt(page),
                totalPages,
                pageSize: parseInt(limit),
                totalItems: total,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    }

    /**
     * Created response
     * @param {Object} res - Express response object
     * @param {*} data - Created resource data
     * @param {String} message - Success message
     */
    static created(res, data, message = 'Resource created successfully') {
        return this.success(res, data, message, 201);
    }

    /**
     * No content response
     * @param {Object} res - Express response object
     */
    static noContent(res) {
        return res.status(204).send();
    }

    /**
     * Not found response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static notFound(res, message = 'Resource not found') {
        return this.error(res, message, 404);
    }

    /**
     * Unauthorized response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static unauthorized(res, message = 'Unauthorized access') {
        return this.error(res, message, 401);
    }

    /**
     * Forbidden response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     */
    static forbidden(res, message = 'Forbidden') {
        return this.error(res, message, 403);
    }

    /**
     * Bad request response
     * @param {Object} res - Express response object
     * @param {String} message - Error message
     * @param {*} errors - Validation errors
     */
    static badRequest(res, message = 'Bad request', errors = null) {
        const response = {
            status: 'fail',
            message,
        };

        if (errors) {
            response.errors = errors;
        }

        return res.status(400).json(response);
    }
}

export default ApiResponse;
