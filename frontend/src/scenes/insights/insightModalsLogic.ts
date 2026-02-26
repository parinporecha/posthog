import { actions, kea, key, path, props, reducers } from 'kea'

import { InsightLogicProps } from '~/types'

import type { insightModalsLogicType } from './insightModalsLogicType'
import { keyForInsightLogicProps } from './sharedUtils'

export const insightModalsLogic = kea<insightModalsLogicType>([
    props({} as InsightLogicProps),
    key(keyForInsightLogicProps('new')),
    path((key) => ['scenes', 'insights', 'insightModalsLogic', key]),

    actions({
        openAddToDashboardModal: true,
        closeAddToDashboardModal: true,
        openTablePreviewModal: true,
        closeTablePreviewModal: true,
        openTerraformModal: true,
        closeTerraformModal: true,
    }),

    reducers({
        isAddToDashboardModalOpen: [
            false,
            {
                openAddToDashboardModal: () => true,
                closeAddToDashboardModal: () => false,
            },
        ],
        isTablePreviewModalOpen: [
            false,
            {
                openTablePreviewModal: () => true,
                closeTablePreviewModal: () => false,
            },
        ],
        isTerraformModalOpen: [
            false,
            {
                openTerraformModal: () => true,
                closeTerraformModal: () => false,
            },
        ],
    }),
])
