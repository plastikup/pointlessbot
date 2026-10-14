interface FailureBody {
	message: string,
	detail?: Record<string, unknown>,
	stack?: unknown,
}

export interface Fail {
	body: FailureBody,
	fail: true,
}
export interface Success<T> {
	body: T,
	fail: false,
}

/** Represents a value that may or may not be an error. Not meant to be used on repositories. */
export type Failable<T> = Success<T> | Fail

export const fail = (body: FailureBody): Fail => ({ body, fail: true })
export function success(): Success<void>
export function success<T>(body: T): Success<T>
export function success<T>(body?: T): Success<T | void> {
	return { body, fail: false }
}
