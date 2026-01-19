/**
 * Enum que define los tipos de permisos disponibles para los tests/folders
 */
export enum Permission {
  OWNER = 'owner',
  EDIT = 'edit',
  EXECUTE = 'execute',
  VIEW = 'view'
}

/**
 * Tipo que agrupa los permisos que permiten ejecutar acciones
 */
export const EXECUTE_PERMISSIONS = [Permission.OWNER, Permission.EDIT, Permission.EXECUTE];

/**
 * Tipo que agrupa los permisos que permiten editar
 */
export const EDIT_PERMISSIONS = [Permission.OWNER, Permission.EDIT];

/**
 * Tipo que agrupa los permisos que permiten ver evidencias (todos los permisos)
 */
export const VIEW_PERMISSIONS = [Permission.OWNER, Permission.EDIT, Permission.EXECUTE, Permission.VIEW];

/**
 * Tipo que agrupa todos los permisos
 */
export const ALL_PERMISSIONS = [Permission.OWNER, Permission.EDIT, Permission.EXECUTE, Permission.VIEW];

