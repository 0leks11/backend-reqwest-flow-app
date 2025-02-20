interface Organization {
  id: string;
  children?: Organization[];
}

export function getAllOrgIds(organizations: Organization[]): string[] {
  const result: string[] = [];
  function traverse(orgs: Organization[]) {
    for (const org of orgs) {
      result.push(org.id);
      if (org.children) {
        traverse(org.children);
      }
    }
  }
  traverse(organizations);
  return result;
}
