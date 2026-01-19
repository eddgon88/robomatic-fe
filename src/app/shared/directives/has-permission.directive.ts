import { Directive, Input, TemplateRef, ViewContainerRef, DoCheck } from '@angular/core';
import { Permission } from '../enums/permission.enum';

/**
 * Interface que define la estructura mínima requerida para verificar permisos
 */
interface PermissionRecord {
  permissions: string;
  is_running?: boolean;
  type?: string;
}

/**
 * Directiva estructural para controlar la visibilidad de elementos
 * basándose en los permisos del usuario sobre un record (test/folder).
 * 
 * Implementa DoCheck para detectar cambios en propiedades internas del objeto
 * (como is_running) que no serían detectados por OnChanges.
 * 
 * @example
 * <!-- Mostrar si tiene permisos de owner, edit o execute -->
 * <button *hasPermission="['owner', 'edit', 'execute']; for: element">
 *   Ejecutar
 * </button>
 * 
 * @example
 * <!-- Mostrar si tiene permisos Y el test NO está corriendo -->
 * <button *hasPermission="['owner', 'edit']; for: element; whenRunning: false">
 *   Editar
 * </button>
 * 
 * @example
 * <!-- Mostrar si tiene permisos Y el test SÍ está corriendo -->
 * <button *hasPermission="['owner', 'edit', 'execute']; for: element; whenRunning: true">
 *   Ver VNC
 * </button>
 * 
 * @example
 * <!-- Usando el enum de permisos -->
 * <button *hasPermission="EDIT_PERMISSIONS; for: element; whenRunning: false">
 *   Editar
 * </button>
 * 
 * @example
 * <!-- Condición adicional OR con tipo -->
 * <button *hasPermission="['owner', 'edit']; for: element; whenRunning: false; orType: 'folder'">
 *   Eliminar
 * </button>
 */
@Directive({
  selector: '[hasPermission]'
})
export class HasPermissionDirective implements DoCheck {
  
  private hasView = false;
  
  /**
   * Lista de permisos requeridos (OR - cualquiera de ellos)
   */
  private permissions: (Permission | string)[] = [];
  
  /**
   * El record sobre el cual verificar permisos
   */
  private record: PermissionRecord | null = null;
  
  /**
   * Condición adicional sobre el estado de ejecución
   * null = no importa el estado
   * true = debe estar corriendo
   * false = no debe estar corriendo
   */
  private runningCondition: boolean | null = null;
  
  /**
   * Condición OR adicional basada en el tipo del record
   * Si el tipo coincide, se muestra sin importar los permisos
   */
  private orType: string | null = null;

  /**
   * Cache del último valor de is_running para detectar cambios
   */
  private lastIsRunning: boolean | undefined = undefined;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  /**
   * Input principal: lista de permisos requeridos
   */
  @Input()
  set hasPermission(permissions: (Permission | string)[]) {
    this.permissions = permissions || [];
  }

  /**
   * Input: el record sobre el cual verificar permisos
   */
  @Input()
  set hasPermissionFor(record: PermissionRecord | null) {
    this.record = record;
  }

  /**
   * Input opcional: condición sobre el estado de ejecución
   */
  @Input()
  set hasPermissionWhenRunning(condition: boolean | null) {
    this.runningCondition = condition;
  }

  /**
   * Input opcional: tipo alternativo que permite mostrar el elemento
   */
  @Input()
  set hasPermissionOrType(type: string | null) {
    this.orType = type;
  }

  /**
   * DoCheck se ejecuta en cada ciclo de detección de cambios
   * Esto permite detectar cambios en propiedades internas del objeto
   */
  ngDoCheck(): void {
    this.updateView();
  }

  /**
   * Actualiza la vista basándose en las condiciones actuales
   */
  private updateView(): void {
    const shouldShow = this.evaluateConditions();
    
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }

  /**
   * Evalúa todas las condiciones para determinar si mostrar el elemento
   */
  private evaluateConditions(): boolean {
    // Si no hay record, no mostrar
    if (!this.record) {
      return false;
    }

    // Verificar condición OR por tipo primero
    if (this.orType && this.record.type === this.orType) {
      // Si el tipo coincide, verificar solo la condición de running si aplica
      return this.checkRunningCondition();
    }

    // Verificar permisos
    const hasRequiredPermission = this.checkPermissions();
    
    // Verificar estado de ejecución
    const meetsRunningCondition = this.checkRunningCondition();

    return hasRequiredPermission && meetsRunningCondition;
  }

  /**
   * Verifica si el record tiene alguno de los permisos requeridos
   */
  private checkPermissions(): boolean {
    if (this.permissions.length === 0) {
      return true; // Sin permisos requeridos = siempre permitido
    }

    return this.permissions.some(
      permission => this.record?.permissions === permission
    );
  }

  /**
   * Verifica la condición de estado de ejecución
   */
  private checkRunningCondition(): boolean {
    // Si no hay condición específica, siempre cumple
    if (this.runningCondition === null) {
      return true;
    }

    // Tratar undefined como false (no está corriendo)
    // Esto es necesario para folders que no tienen is_running
    const isRunning = this.record?.is_running ?? false;
    return isRunning === this.runningCondition;
  }
}

