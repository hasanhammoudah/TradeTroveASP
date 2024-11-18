using System;
using System.Collections.Generic;
using Core.Entities;
using Core.Specifications;

namespace Core.Interfaces
{
    public interface IGenericRepository<T> where T : BaseEntity
    {
        Task<T> GetByIdAsync(int id);
             ///<summary>
            ///  In summary, IReadOnlyList<T> is useful for scenarios where you need to expose a list of elements but want to ensure that the collection remains unchanged by the consumers of the API.
            ///  باختصار، IReadOnlyList<T> مفيد في السيناريوهات التي تحتاج فيها إلى عرض قائمة من العناصر ولكنك تريد التأكد من أن المجموعة تظل دون تغيير من قبل مستهلكي واجهة برمجة التطبيقات.
           /// </summary>
        Task<IReadOnlyList<T>> ListAllAsync();

        Task<T> GetEntityWithSpec(ISpecification<T> spec);
        Task<IReadOnlyList<T>> ListAsync(ISpecification<T>spec);
        Task<int> CountAsync(ISpecification<T> spec);

        void Add(T entity);
        void Update(T entity);
        void Delete(T entity);
    }
}