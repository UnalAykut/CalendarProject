using System.Linq.Expressions;

public interface IRepository<T> where T : class
{
    Task<IEnumerable<T>> GetAllAsync();
    Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter = null, params Expression<Func<T, object>>[] includes);
    Task<T> GetAsync(Expression<Func<T, bool>> filter, params Expression<Func<T, object>>[] includes);

    Task<T> GetByIdAsync(int id);
    Task AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task DeleteAsync(int id);
    Task<T> FindAsync(Expression<Func<T, bool>> predicate);

}
