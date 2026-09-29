/**
 * coordinatorStore.ts
 * A lightweight localStorage-backed store for tracking pending and approved
 * coordinator registration requests. Used to bridge AuthContext, AdminCoordinatorsPage,
 * and user role permissions across sessions.
 */

import { UserProfile } from '../types/database';

const PENDING_STORAGE_KEY = 'colorido_pending_coordinators_v1';
const APPROVED_STORAGE_KEY = 'colorido_approved_coordinators_v1';
const AUTH_STORAGE_KEY = 'colorido_auth_user_v1';

/** Read all pending coordinator requests from localStorage */
export function getPendingCoordinators(): UserProfile[] {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return [];
  }
}

/** Add a newly registered coordinator to the pending queue */
export function addPendingCoordinator(user: UserProfile): void {
  try {
    const existing = getPendingCoordinators();
    if (existing.some(u => u.id === user.id || u.email.toLowerCase() === user.email.toLowerCase())) return;
    existing.push(user);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // silently fail
  }
}

/** Remove a coordinator from the pending queue (after approve/reject) */
export function removePendingCoordinator(id: string): void {
  try {
    const updated = getPendingCoordinators().filter(u => u.id !== id);
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // silently fail
  }
}

/** Get list of approved coordinators */
export function getApprovedCoordinators(): UserProfile[] {
  try {
    const raw = localStorage.getItem(APPROVED_STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as UserProfile[];
  } catch {
    return [];
  }
}

/** Built-in demo coordinator emails that are always pre-approved */
const BUILTIN_APPROVED_EMAILS = new Set([
  'coordinator@colorido2k26.edu',
]);

/** Check if a given email or ID belongs to an approved coordinator */
export function isCoordinatorApproved(emailOrId: string): boolean {
  if (!emailOrId) return false;
  const target = emailOrId.toLowerCase();
  // Always approve built-in demo coordinators
  if (BUILTIN_APPROVED_EMAILS.has(target)) return true;
  const list = getApprovedCoordinators();
  return list.some(u => u.id.toLowerCase() === target || u.email.toLowerCase() === target);
}

/** Approve a coordinator request: moves to approved list and updates logged-in user if matching */
export function approveCoordinator(userToApprove: UserProfile): void {
  try {
    // 1. Remove from pending queue
    removePendingCoordinator(userToApprove.id);

    // 2. Add to approved queue
    const approved = getApprovedCoordinators();
    const updatedUser: UserProfile = {
      ...userToApprove,
      role: 'coordinator',
      coordinator_status: 'approved',
    };

    if (!approved.some(u => u.id === userToApprove.id || u.email.toLowerCase() === userToApprove.email.toLowerCase())) {
      approved.push(updatedUser);
      localStorage.setItem(APPROVED_STORAGE_KEY, JSON.stringify(approved));
    }

    // 3. If currently logged-in user matches, update their active profile in localStorage
    const rawAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (rawAuth && rawAuth !== 'logged_out') {
      const activeUser = JSON.parse(rawAuth) as UserProfile;
      if (
        activeUser.id === userToApprove.id ||
        activeUser.email.toLowerCase() === userToApprove.email.toLowerCase()
      ) {
        const newActiveUser: UserProfile = {
          ...activeUser,
          role: 'coordinator',
          coordinator_status: 'approved',
        };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newActiveUser));
      }
    }

    // 4. Notify all components & tabs of state change
    window.dispatchEvent(new CustomEvent('colorido_auth_changed'));
  } catch (e) {
    console.error('Error approving coordinator:', e);
  }
}

/** Reject a coordinator request */
export function rejectCoordinator(id: string): void {
  try {
    removePendingCoordinator(id);
    window.dispatchEvent(new CustomEvent('colorido_auth_changed'));
  } catch (e) {
    console.error('Error rejecting coordinator:', e);
  }
}
