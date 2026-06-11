import { bearerToken, verifyToken } from './auth';
import { assertTableAccess, TableName } from './permissions';

export function jsonError(error: unknown, status = 500) {
  return Response.json({ error: error instanceof Error ? error.message : 'Request failed' }, { status });
}

export function requireUser(request: Request, table?: TableName) {
  const user = verifyToken(bearerToken(request));

  if (!user) {
    return { response: Response.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  if (table) {
    const response = assertTableAccess(user, table);

    if (response) {
      return { response };
    }
  }

  return { user };
}
