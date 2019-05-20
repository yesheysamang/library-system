public with sharing class BookController {
    static Integer PAGE_SIZE = 5;

    public class Filters {
        public String searchKey { get;set; }

        public String[] types { get;set; }

        public String[] status { get;set; }

    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getBooks(String Filters, Integer pageNumber){
        String key, whereClause = '';
        String[] types, status, criteria = new String[]{};
        if (!String.isEmpty(filters)) {
            Filters bookFilters = (Filters) JSON.deserializeStrict(filters, BookController.Filters.class);
            status = bookFilters.status;
            if (!String.isEmpty(bookFilters.searchKey)) {
                key = '%' + bookFilters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (bookFilters.types != null) {
                types = bookFilters.types;
                criteria.add('Book_Type__c IN :types');
            }
            if (bookFilters.status != null) {
                status = bookFilters.status;
                criteria.add('Book_Status__c IN :status');
            }                      
            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join( criteria, ' AND ' );
            }                      
        }
        Integer pageSize = BookController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result =  new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery('SELECT count() FROM Book__c ' + whereClause);
        result.records = Database.query('SELECT Id, Name, LastModifiedById, Author__c, Book_Id__c, Book_Type__c, Date_Last_Borrowed__c, Book_Status__c, Picture_URL__c, Publish_Date__c FROM Book__c ' + whereClause + ' ORDER BY Name LIMIT :pageSize OFFSET :offset');
        return result;
    }
}

