
namespace Backend.Features.Customers;

public class CustomersListQuery : IRequest<List<CustomerssListQueryResponse>>
{
    //get prende il nome set lo assegna
    public string? Name { get; set; }
    public string? Email { get; set; }
}
public class CustomerssListQueryResponse
{

     public int Id { get; set; }
    public string Name { get; internal set; } = "";
    public string Address { get; set; } = "";
    public string Email { get; set; } = "";
    public string Phone { get; set; } = "";
    public string Iban { get; set; } = "";

    public CustomersQueryResponseCategory? Category { get; set; }

}

public class CustomersQueryResponseCategory
{
    public string Code { get; set; } = "";
    public string Description { get; set; } = "";
}
internal class CustomersListQueryHandler(BackendContext context) : IRequestHandler<CustomersListQuery, List<CustomerssListQueryResponse>>
{

       private readonly BackendContext context = context;
public async Task<List<CustomerssListQueryResponse>> Handle(CustomersListQuery request, CancellationToken cancellationToken)

{
      var query = context.Customers.AsQueryable();
      // filtri
      if (!string.IsNullOrEmpty(request.Name))
            query = query.Where(q => q.Name.ToLower().Contains(request.Name.ToLower()));
        if (!string.IsNullOrEmpty(request.Email))
            query = query.Where(q => q.Email.ToLower().Contains(request.Email.ToLower()));

        var data = await query.OrderBy(q => q.Name).ThenBy(q => q.Name).ToListAsync(cancellationToken);
        var result = new List<CustomerssListQueryResponse>();

               foreach (var item in data)
        {
    var resultItem = new CustomerssListQueryResponse
    {
                Id = item.Id,
                Name = item.Name,
                Address = item.Address,
                Email = item.Email,
                Phone = item.Phone,
                Iban = item.Iban,
            };
            
              var category = await context.CustomerCategories.SingleOrDefaultAsync(q => q.Id == item.CustomerCategoryId, cancellationToken);
            if (category is not null)
                resultItem.Category = new CustomersQueryResponseCategory
                {
                    Code = category.Code,
                    Description = category.Description
                };


            result.Add(resultItem);

            


        }
     return result;

}



}
   