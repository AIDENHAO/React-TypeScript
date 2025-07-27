/**
 * SCSS模块类型声明文件
 * 为TypeScript提供SCSS模块的类型定义，使得可以在TS文件中导入SCSS模块
 */

/**
 * 声明所有以.module.scss结尾的文件模块
 * 允许在TypeScript中导入SCSS模块并获得类型安全的类名
 */
declare module '*.module.scss' {
  /** 
   * CSS类名映射对象
   * 键为SCSS中定义的类名，值为编译后的实际类名
   */
  const classes: { [key: string]: string };
  export default classes;
}