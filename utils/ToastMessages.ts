export type ToastMessageTypes = "success"|"error"|"info"|"warn"
export const toastMessageParamPath = (path, type:ToastMessageTypes, title: string, content?:string) => {
    return `${path}?tmsg=${type}&ttext=${title + (content ? `&tcontent=${content}` : ``)}`;
}
