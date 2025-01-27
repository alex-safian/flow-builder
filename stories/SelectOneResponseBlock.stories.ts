import {Component, Vue} from 'vue-property-decorator'
import SelectOneResponseBlock from '@/components/interaction-designer/block-types/MobilePrimitives_SelectOneResponseBlock.vue'
import selectOneStore, {BLOCK_TYPE} from '@/store/flow/block-types/MobilePrimitives_SelectOneResponseBlockStore'

import {SupportedMode} from '@floip/flow-runner'
import Vuex from 'vuex'
import {IRootState, store} from '@/store'
import FlowBuilderSidebarEditorContainer from './story-utils/FlowBuilderSidebarEditorContainer.vue'
import {BaseMountedVueClass, BaseMountedVueClassWithResourceAndMode, IBaseOptions} from './story-utils/storeSetup'

Vue.use(Vuex)

export default {
  component: SelectOneResponseBlock,
  title: 'MobilePrimitives/SelectOneResponseBlock',
}

const SelectOneResponseBlockTemplate = `
    <flow-builder-sidebar-editor-container :block="activeBlock">
      <select-one-response-block
          :block="activeBlock"
          :flow="activeFlow"/>
    </flow-builder-sidebar-editor-container>
  `

const BaseOptions: IBaseOptions = {
  template: SelectOneResponseBlockTemplate,
  components: {
    FlowBuilderSidebarEditorContainer,
    SelectOneResponseBlock,
  },
  store: new Vuex.Store<IRootState>(store),
}

@Component({
  ...BaseOptions,
})
class InFlowBuilderClass extends BaseMountedVueClass {
  async mounted() {
    await this.baseMounted(BLOCK_TYPE, selectOneStore)
  }
}

export const InFlowBuilder = () => InFlowBuilderClass

@Component({
  ...BaseOptions,
})
class IvrOnlyClass extends BaseMountedVueClass {
  async mounted() {
    const {flow} = await this.baseMounted(BLOCK_TYPE, selectOneStore)
    flow.supported_modes = [SupportedMode.IVR]
  }
}

export const IvrOnly = () => IvrOnlyClass

@Component({
  ...BaseOptions,
})
class MoreLanguagesClass extends BaseMountedVueClass {
  async mounted() {
    const {flow} = await this.baseMounted(BLOCK_TYPE, selectOneStore)
    // mutation
    flow.languages = [{id: '1', label: 'English'}, {id: '2', label: 'French'}]
  }
}

export const MoreLanguages = () => MoreLanguagesClass

@Component({
  ...BaseOptions,
})
class ExistingDataClass extends BaseMountedVueClassWithResourceAndMode {
  async mounted() {
    const {block: {uuid: blockId}} = await this.baseMounted(BLOCK_TYPE, selectOneStore)
    this.setDescription(blockId)
    this.setResourceData({
      shouldSetChoices: true,
      configPath: 'config.prompt',
    })
    this.setTags(blockId)
  }
}

export const ExistingData = () => ExistingDataClass
