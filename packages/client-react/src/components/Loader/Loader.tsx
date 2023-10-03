import style from './Loader.module.css'

export default function Loader ({loadingText}: {loadingText:string}) {
  return (
    <div className={style.loaderContainer}>
      <div className={style.loadingLoader}>loading {loadingText}...</div>
    </div>
  )
}