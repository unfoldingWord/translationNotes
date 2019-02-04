import isEqual from 'deep-equal';

/**
* @description gets the group data for the current verse from groupsDataReducer
* @param {Object} state
* @param {Object} contextId
* @return {object} group data object.
*/
export function getGroupDataForVerse(getGroupsData, contextId, toolName) {
  const groupsData = getGroupsData(toolName);
  const filteredGroupData = {};
  for (let groupItemKey of Object.keys(groupsData)) {
    const groupItem = groupsData[groupItemKey];
    if (groupItem) {
      for (let check of groupItem) {
        try {
          if (isEqual(check.contextId.reference, contextId.reference)) {
            if (!filteredGroupData[groupItemKey]) {
              filteredGroupData[groupItemKey] = [];
            }
            filteredGroupData[groupItemKey].push(check);
          }
        } catch (e) {
          console.warn(`Corrupt check found in group "${groupItemKey}"`, check);
        }
      }
    }
  }
  return filteredGroupData;
}


/**
 * returns true if contextIds are a match for reference and group
 * @param {Object} contextId1
 * @param {Object} contextId2
 * @return {boolean}
 */
export function sameContext(contextId1, contextId2) {
  if (!!contextId1 && !!contextId2) {
    return isEqual(contextId1.reference, contextId2.reference) &&
      (contextId1.groupId === contextId2.groupId);
  }
  return false;
}