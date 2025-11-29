export function can(
  userPermissions: { resource: string; action: string }[], 
  resource: string,
  action: string
): boolean {
  return userPermissions.some(
    p => p.resource === resource && p.action === action
  );
}