export class PatternForbiddenError extends Error {
  override readonly name = "PatternForbiddenError";
}

export class PatternNotFoundError extends Error {
  override readonly name = "PatternNotFoundError";
}

export class PatternInvalidVersionError extends Error {
  override readonly name = "PatternInvalidVersionError";
}
