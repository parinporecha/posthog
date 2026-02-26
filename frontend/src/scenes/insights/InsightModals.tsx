import { useActions, useValues } from 'kea'
import { router } from 'kea-router'

import { AddToDashboardModal } from 'lib/components/AddToDashboard/AddToDashboardModal'
import { areAlertsSupportedForInsight } from 'lib/components/Alerts/insightAlertsLogic'
import { EditAlertModal } from 'lib/components/Alerts/views/EditAlertModal'
import { ManageAlertsModal } from 'lib/components/Alerts/views/ManageAlertsModal'
import { SharingModal } from 'lib/components/Sharing/SharingModal'
import { SubscriptionsModal } from 'lib/components/Subscriptions/SubscriptionsModal'
import { TerraformExportModal } from 'lib/components/TerraformExporter/TerraformExportModal'
import { NewDashboardModal } from 'scenes/dashboard/NewDashboardModal'
import { insightDataLogic } from 'scenes/insights/insightDataLogic'
import { insightLogic } from 'scenes/insights/insightLogic'
import { insightSceneLogic } from 'scenes/insights/insightSceneLogic'
import { urls } from 'scenes/urls'

import { HogQLQuery, InsightQueryNode } from '~/queries/schema/schema-general'
import { InsightLogicProps, InsightShortId, ItemMode } from '~/types'

import { EndpointFromInsightModal } from 'products/endpoints/frontend/EndpointFromInsightModal'

import { insightModalsLogic } from './insightModalsLogic'
import { InsightTablePreviewModal } from './InsightTablePreviewModal'

export function InsightModals({ insightLogicProps }: { insightLogicProps: InsightLogicProps }): JSX.Element | null {
    const { insightMode, itemId, alertId } = useValues(insightSceneLogic)

    const theInsightLogic = insightLogic(insightLogicProps)
    const { insightProps, canEditInsight, insight, hasDashboardItemId, derivedName } = useValues(theInsightLogic)

    const theInsightDataLogic = insightDataLogic(insightProps)
    const { query, insightQuery, insightData } = useValues(theInsightDataLogic)

    const { push } = useActions(router)

    const theInsightModalsLogic = insightModalsLogic(insightLogicProps)
    const { isAddToDashboardModalOpen, isTablePreviewModalOpen, isTerraformModalOpen } =
        useValues(theInsightModalsLogic)
    const { closeAddToDashboardModal, closeTablePreviewModal, closeTerraformModal } = useActions(theInsightModalsLogic)

    const canCreateAlertForInsight = areAlertsSupportedForInsight(query)
    const closeToInsightView = (): void => {
        push(urls.insightView(insight.short_id as InsightShortId))
    }

    return (
        <>
            {hasDashboardItemId && (
                <>
                    <SubscriptionsModal
                        isOpen={insightMode === ItemMode.Subscriptions}
                        closeModal={closeToInsightView}
                        insightShortId={insight.short_id}
                        subscriptionId={typeof itemId === 'number' || itemId === 'new' ? itemId : null}
                    />
                    <SharingModal
                        title="Insight sharing"
                        isOpen={insightMode === ItemMode.Sharing}
                        closeModal={closeToInsightView}
                        insightShortId={insight.short_id}
                        insight={insight}
                        cachedResults={insightData}
                        previewIframe
                        userAccessLevel={insight.user_access_level}
                    />
                    <AddToDashboardModal
                        isOpen={isAddToDashboardModalOpen}
                        closeModal={closeAddToDashboardModal}
                        insightProps={insightProps}
                        canEditInsight={canEditInsight}
                    />
                    {insightMode === ItemMode.Alerts && (
                        <ManageAlertsModal
                            onClose={closeToInsightView}
                            isOpen={insightMode === ItemMode.Alerts}
                            insightLogicProps={insightLogicProps}
                            insightId={insight.id as number}
                            insightShortId={insight.short_id as InsightShortId}
                            canCreateAlertForInsight={canCreateAlertForInsight}
                        />
                    )}

                    {!!alertId && insight.id && (
                        <EditAlertModal
                            onClose={() => push(urls.insightAlerts(insight.short_id as InsightShortId))}
                            isOpen={!!alertId}
                            alertId={alertId === null || alertId === 'new' ? undefined : alertId}
                            insightShortId={insight.short_id as InsightShortId}
                            insightId={insight.id}
                            onEditSuccess={() => {
                                push(urls.insightAlerts(insight.short_id as InsightShortId))
                            }}
                            insightLogicProps={insightLogicProps}
                        />
                    )}
                    <NewDashboardModal />
                    <EndpointFromInsightModal
                        tabId={insightProps.tabId || ''}
                        insightQuery={insightQuery as HogQLQuery | InsightQueryNode}
                        insightShortId={insight.short_id}
                    />
                </>
            )}

            <TerraformExportModal
                isOpen={isTerraformModalOpen}
                onClose={closeTerraformModal}
                resource={{ type: 'insight', data: { ...insight, query, derived_name: derivedName } }}
            />
            <InsightTablePreviewModal isOpen={isTablePreviewModalOpen} onClose={closeTablePreviewModal} />
        </>
    )
}
