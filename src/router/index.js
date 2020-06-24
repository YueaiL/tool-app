import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import IndexPage from '@/components/IndexPage'
import SerialPortControl from '@/components/SerialPortControl'
import NbiotDataPars from '@/components/NbiotDataPars'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'IndexPage',
      component: IndexPage,
      /*children:[
        {
          path:'hello',
          redirect: HelloWorld
        }
      ]*/
    },
    {
      path:'/hello',
      name: 'HelloWord',
      component: HelloWorld
    },
    {
      path: '/scon',
      name: 'SerialPortControl',
      component: SerialPortControl
    },
    {
      path: '/nbiot',
      name: 'dataPars',
      component: NbiotDataPars
    }
  ],
  mode: 'history',
  base: '/nb/'
})
