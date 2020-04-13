export default function ({ store, redirect}) {
  if (!store.state.user.isLogin) {
    return redirect('/shop/login')
  }
}