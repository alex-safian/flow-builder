import Vue from 'vue'
import Flow from '@flowjs/flow.js'
import lodash from 'lodash'
import Component from 'vue-class-component'

const dispatch = (el: any, name: string, data: any) => {
  el.dispatchEvent(lodash.extend(new Event(name, {
    bubbles: true,
    cancelable: true,
  }), {data}))
}

@Component({
  directives: {
    'flow-uploader': {
      /**
       * This binding provides a bridge between Flow and vuejs such that we can continue using our resumable backend
       */
      bind(el, binding) {
        const {
          accept,
          target,
          token: upload_token,
        } = binding.value
        const uploader = new Flow({
          target,
          singleFile: true,
          // kbytes, chunked?  ¯\_(ツ)_/¯
          chunkSize: 1024 * 512,
          query: {upload_token},
        })

        if (!uploader.support) {
          // Your browser doesn't support HTML5 uploads; please try Firefox or Chrome.
          return
        }

        lodash.extend(el.style, {overflow: 'hidden'})
        uploader.assignBrowse(el)

        lodash.chain(el.children)
          .find({
            tagName: 'INPUT',
            type: 'file',
          } as any)
          .assign({accept})
          .value()

        // todo: migrate to proxied catch-all handler (voto5 legacy todo)
        // uploader.on('catchAll', (name, file/*or files*/, e) => console.debug(name))

        // todo: when do we call upload on a multiselect-upload and file-added triggered multiple times? (voto5 legacy todo)
        // uploader.upload()
        // uploader.on('fileAdded', (file, e) => dispatch(el, 'filesSubmitted', {file, uploader}))
        // @ts-ignore
        uploader.on('filesSubmitted', (files: any, e: any) => dispatch(el, 'filesSubmitted', {
          files,
          uploader,
          // uploader.upload()
        }))
        // @ts-ignore
        uploader.on('fileProgress', (file: any, e: any) => dispatch(el, 'fileProgress', {
          file,
          uploader,
        }))
        uploader.on('fileSuccess', (file: any, json: any) => dispatch(el, 'fileSuccess', {
          file,
          uploader,
          json,
          // uploader.cancel()
        }))
        uploader.on('error', (message: string, file: any) => dispatch(el, 'fileSuccess', {
          file,
          uploader,
          message,
          // uploader.cancel()
        }))
      },

      // @ts-ignore
      unbind(el, binding) {
      },
    },
  },
})
export default class FlowUploader extends Vue {
}
