// ////////////////////////////////////////////////////////////////////// Export
// -----------------------------------------------------------------------------
export const useResolveDoczillaComponent = (name) => {
  if (!name) { return false }
  const instance = getCurrentInstance()
  const compToResolve = `Doczilla${useToPascalCase(name)}`
  if (
    typeof instance?.appContext.components === 'object' &&
    compToResolve in instance.appContext.components
  ) {
    return compToResolve
  }
  return false
}
