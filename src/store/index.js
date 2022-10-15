import { defineStore} from 'pinia'

export const mainStore = defineStore('main',{
  state:()=>{
    return {
      openshow:false, //左侧展示不展示
      opennum: "200px", //左侧宽度
    }
  },
  getters:{},
  actions:{}
})