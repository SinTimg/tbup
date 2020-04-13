
export default function ({isServer, store, redirect, req}) {
  if (store.state.admin.isLogin) {
    return redirect('/admin/manager/order/list')
  }
  
  if (isServer) {
    let admin = req.session.admin
    if (admin) {
      store.commit('admin/setAdmin', admin)
      redirect('/admin/manager/order/list')
    }
  }
}
