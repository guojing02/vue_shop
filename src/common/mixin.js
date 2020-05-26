export const itemIfMixin = {
  data(){
    return{
      
    }
  },
  methods:{
    get200(res,err,success){
        if (res.meta.status !== 200) {
          return this.$message.error(err);
        }
        this.$message.success(success)
      },
    get201(res,err,success){
      if (res.meta.status !== 201) {
        return this.$message.error(err);
      }
      this.$message.success(success)
    },
  },

}