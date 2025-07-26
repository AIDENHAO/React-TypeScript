/**
 * 基础数据服务类 - 提供通用的数据管理功能
 * 减少代码重复，提高扩展性
 */
export abstract class BaseDataService<T> {
  protected abstract storageKey: string;
  protected abstract validateData(data: T): boolean;
  protected abstract getDefaultData(): T[];

  /**
   * 保存数据到localStorage
   * @param data 要保存的数据
   */
  protected saveToStorage(data: T[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error(`保存数据到 ${this.storageKey} 失败:`, error);
      throw new Error(`数据保存失败`);
    }
  }

  /**
   * 从localStorage加载数据
   * @returns 加载的数据数组
   */
  protected loadFromStorage(): T[] {
    try {
      const data = localStorage.getItem(this.storageKey);
      if (data) {
        const parsedData = JSON.parse(data);
        return Array.isArray(parsedData) ? parsedData : [];
      }
      return this.getDefaultData();
    } catch (error) {
      console.error(`从 ${this.storageKey} 加载数据失败:`, error);
      return this.getDefaultData();
    }
  }

  /**
   * 获取所有数据
   * @returns 所有数据
   */
  public getAll(): T[] {
    return this.loadFromStorage();
  }

  /**
   * 根据ID查找数据
   * @param id 数据ID
   * @param getIdFn 获取ID的函数
   * @returns 找到的数据或null
   */
  public findById(id: string, getIdFn: (item: T) => string): T | null {
    const allData = this.getAll();
    return allData.find(item => getIdFn(item) === id) || null;
  }

  /**
   * 保存单个数据项
   * @param item 要保存的数据项
   * @param getIdFn 获取ID的函数
   */
  public save(item: T, getIdFn: (item: T) => string): void {
    if (!this.validateData(item)) {
      throw new Error('数据格式验证失败');
    }

    const allData = this.getAll();
    const id = getIdFn(item);
    const existingIndex = allData.findIndex(existing => getIdFn(existing) === id);

    if (existingIndex >= 0) {
      allData[existingIndex] = item;
    } else {
      allData.push(item);
    }

    this.saveToStorage(allData);
  }

  /**
   * 删除数据项
   * @param id 要删除的数据ID
   * @param getIdFn 获取ID的函数
   * @returns 是否删除成功
   */
  public delete(id: string, getIdFn: (item: T) => string): boolean {
    const allData = this.getAll();
    const filteredData = allData.filter(item => getIdFn(item) !== id);
    
    if (filteredData.length === allData.length) {
      return false; // 没有找到要删除的项
    }

    this.saveToStorage(filteredData);
    return true;
  }

  /**
   * 清空所有数据
   */
  public clear(): void {
    try {
      localStorage.removeItem(this.storageKey);
    } catch (error) {
      console.error(`清空 ${this.storageKey} 数据失败:`, error);
      throw new Error('清空数据失败');
    }
  }

  /**
   * 获取数据统计信息
   * @returns 统计信息
   */
  public getStats(): {
    total: number;
    storageSize: number;
    lastModified: Date | null;
  } {
    try {
      const data = this.getAll();
      const storageData = localStorage.getItem(this.storageKey) || '';
      
      return {
        total: data.length,
        storageSize: new Blob([storageData]).size,
        lastModified: data.length > 0 ? new Date() : null
      };
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return {
        total: 0,
        storageSize: 0,
        lastModified: null
      };
    }
  }

  /**
   * 导出数据
   * @returns JSON格式的数据字符串
   */
  public export(): string {
    try {
      const data = this.getAll();
      return JSON.stringify(data, null, 2);
    } catch (error) {
      console.error('导出数据失败:', error);
      throw new Error('导出数据失败');
    }
  }

  /**
   * 导入数据
   * @param jsonData JSON格式的数据字符串
   * @returns 是否导入成功
   */
  public import(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      if (!Array.isArray(data)) {
        throw new Error('数据格式错误：必须是数组');
      }

      // 验证每个数据项
      for (const item of data) {
        if (!this.validateData(item)) {
          throw new Error('数据项格式验证失败');
        }
      }

      this.saveToStorage(data);
      return true;
    } catch (error) {
      console.error('导入数据失败:', error);
      return false;
    }
  }
}